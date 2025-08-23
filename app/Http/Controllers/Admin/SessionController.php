<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSessionRequest;
use App\Models\Attendance;
use App\Models\Child;
use App\Models\ClassModel;
use App\Models\Session;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class SessionController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $query = Session::with(['classModel', 'admin']);

        if (!$user->hasRole(['Superadmin', 'Management'])) {
            $query->where('created_by', $user->id);
        }

        $sessions = $query
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

    public function edit(Session $session)
    {
        // Muat relasi kelas, dan semua anak yang terdaftar di kelas tersebut
        $session->load('classModel.childrens');

        // Ambil semua anak dari kelas ini
        $childrenInClass = $session->classModel->childrens;

        // Buat koleksi data kehadiran yang LENGKAP untuk form
        $attendanceDataForForm = $childrenInClass->map(function ($child) use ($session) {
            // Cari data kehadiran yang sudah ada untuk anak ini di sesi ini
            $attendance = $session->attendances()->where('children_id', $child->id)->first();

            return [
                'id'         => $attendance ? $attendance->id : null,
                'child_id'   => $child->id,
                'child_name' => $child->name,
                'status'     => $attendance ? $attendance->status->value : 'Absent', // Default status
            ];
        });

        // Kirim data yang sudah lengkap ini ke frontend
        return Inertia::render('admin/session/edit', [
            'session'         => $session,
            'attendance_data' => $attendanceDataForForm,
        ]);
    }

    public function update(UpdateSessionRequest $request, Session $session): RedirectResponse
    {
        $validated = $request->validated();
                // dd($validated);


        // Gunakan DB Transaction untuk memastikan semua operasi berhasil atau tidak sama sekali
        DB::transaction(function () use ($validated, $session) {
            // Update topik sesi
            $session->update([
                'topic' => $validated['topic'],
            ]);

            // Proses setiap data kehadiran dari form
            foreach ($validated['attendances'] as $attendanceData) {
                // Cek apakah anak ada (jika ID anak dikirim dari form)
                $child = Child::find($attendanceData['child_id']); // Asumsi 'child_id' ada di form

                if (!$child) continue; // Lewati jika anak tidak ditemukan

                // Gunakan updateOrCreate untuk menangani anak lama dan anak baru
                $newAttendance = Attendance::updateOrCreate(
                    [
                        // Kondisi untuk mencari record: cocokkan sesi DAN anak
                        'session_id'  => $session->id,
                        'children_id' => $child->id,
                    ],
                    [
                        // Data yang akan di-update atau di-create
                        'status' => $attendanceData['status'],
                    ]
                );

                // Setelah update/create, hitung ulang total kehadiran anak
                // Ini adalah pendekatan yang lebih baik daripada increment/decrement
                $newAttendanceCount = Attendance::where('children_id', $child->id)
                    ->whereIn('status', ['Present', 'Late'])
                    ->count();

                $child->update([
                    'attendance_count' => $newAttendanceCount
                ]);
            }
        });

        return to_route('admin.session.show', $session->id)->with('success', 'Session updated successfully.');
    }
}
