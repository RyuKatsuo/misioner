<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\Session;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    /**
     * Menampilkan halaman absensi untuk sesi tertentu.
     */
    public function show(Session $session): Response
    {
        // Muat relasi yang dibutuhkan untuk ditampilkan
        $session->load(['classModel.period', 'attendances.child']);

        return Inertia::render('admin/attendance/show', [
            'session' => $session,
        ]);
    }

    /**
     * Memproses check-in (kehadiran) berdasarkan kode QR.
     */
    public function checkIn(Request $request, Session $session): RedirectResponse
    {
        // --- Validasi 1: Pengecekan Admin ---
        // Pastikan admin yang sedang login adalah yang membuat sesi.
        if (auth()->id() !== $session->created_by) {
            return back()->with('error', 'You are not authorized to take attendance for this session.');
        }

        $validated = $request->validate([
            'qr_code' => ['required', 'string'],
        ]);

        $child = Child::where('qr_code', $validated['qr_code'])->first();

        if (!$child) {
            return back()->with('error', 'QR Code not found in records.');
        }

        if ($child->class_id !== $session->class_id) {
            return back()->with('error', "Error: {$child->name} is not a member of this class.");
        }

        $attendance = $session->attendances()->where('children_id', $child->id)->first();

        if ($attendance && $attendance->status->value === 'Absent') {
            // --- Validasi 2: Pengecekan Waktu Keterlambatan ---
            $sessionCreatedAt = Carbon::parse($session->created_at);
            $now = Carbon::now();

            // Hitung selisih waktu dalam menit
            $minutesDiff = $sessionCreatedAt->diffInMinutes($now);

            // Tentukan status berdasarkan selisih waktu
            $newStatus = ($minutesDiff > 15) ? 'Late' : 'Present';

            $attendance->status = $newStatus;
            $attendance->save();

            $child->increment('attendance_count');

            return back()->with('success', "{$child->name}! (Status: {$newStatus})");
        }

        $errorMessage = $attendance ? 'Child already marked present or late.' : 'This child is not enrolled in this session.';
        return back()->with('error', $errorMessage);
    }
}
