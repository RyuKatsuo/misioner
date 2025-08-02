<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSessionRequest;
use App\Models\Attendance;
use App\Models\ClassModel;
use App\Models\Session;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class SessionController extends Controller
{
    public function index(Request $request): Response
    {
        $sessions = Session::with(['classModel', 'admin'])
            ->latest('session_date')
            ->latest('created_at')
            ->paginate(10);

        // Data kelas untuk form 'create'
        // menampilkan kelas yang periodenya aktif dan memili lebih dari 1 anak
        $classes = ClassModel::whereHas('childrens')
            ->whereHas('period', function ($query) {
                $query->where('is_active', true);
            })
            ->get(['id', 'class_name',]);

        return Inertia::render('admin/session/index', [
            'sessions' => $sessions,
            'classes' => $classes,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'class_id' => ['required', 'uuid', 'exists:class,id'],
            'topic' => ['nullable', 'string', 'max:255'],
        ]);

        $class = ClassModel::with('childrens')->findOrFail($validated['class_id']);

        if ($class->childrens->isEmpty()) {
            return back()->with('error', 'This class has no children to create a session for.');
        }

        try {
            $session = DB::transaction(function () use ($validated, $class) {
                // 1. Buat Sesi
                $session = Session::create([
                    'class_id' => $class->id,
                    'topic' => $validated['topic'],
                    'session_date' => today(),
                    'created_by' => auth()->id(),
                ]);

                // 2. Siapkan data absensi
                $attendanceData = [];
                foreach ($class->childrens as $child) {
                    $attendanceData[] = [
                        'id' => \Illuminate\Support\Str::uuid(),
                        'session_id' => $session->id,
                        'children_id' => $child->id,
                        'status' => 'Absent',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // 3. Masukkan semua data absensi sekaligus
                Attendance::insert($attendanceData);

                return $session;
            });
        } catch (Throwable $e) {
            return back()->with('error', 'Failed to create session and generate attendance list.');
        }

        return to_route('admin.attendances.show', $session->id)->with('success', 'Session created successfully!');
    }

    public function show(Session $session): Response
    {
        // Muat semua relasi yang dibutuhkan untuk detail
        $session->load(['classModel', 'admin', 'attendances.child']);
        return Inertia::render('admin/session/show', [
            'session' => $session
        ]);
    }

    public function edit(Session $session): Response
    {
        $session->load(['attendances.child', 'classModel']);
        return Inertia::render('admin/session/edit', [
            'session' => $session
        ]);
    }

    public function update(UpdateSessionRequest $request, Session $session): RedirectResponse
    {
        $validated = $request->validated();

        // Update topik sesi
        $session->topic = $validated['topic'];
        $session->save();

        // Update status kehadiran setiap anak
        foreach ($validated['attendances'] as $attendanceData) {
            $attendance = Attendance::find($attendanceData['id']);
            if ($attendance && $attendance->session_id === $session->id) {
                $attendance->status = $attendanceData['status'];
                $attendance->save();
            }
        }

        return to_route('admin.session.show', $session->id)->with('success', 'Session updated successfully.');
    }
}
