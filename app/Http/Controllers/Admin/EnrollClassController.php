<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EnrollChildrenRequest;
use App\Models\Child;
use App\Models\ClassModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class EnrollClassController extends Controller
{
    public function showEnrollForm(Request $request, ClassModel $class): Response
    {
        $availableChildren = Child::with('parent')
            ->where('is_active', false)
            ->doesntHave('graduate')
            ->when($request->input('search'), function ($q, $search) {
                $q->where(function ($subq) use ($search) {
                    $subq->where('name', 'ilike', "%{$search}%")
                        ->orWhereHas('parent', function ($parentQuery) use ($search) {
                            $parentQuery->where('name', 'ilike', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->get();

        return Inertia::render('admin/class/enroll', [
            'class' => $class,
            'availableChildren' => $availableChildren,
            'filters' => $request->only(['search']),
        ]);
    }

    public function enroll(EnrollChildrenRequest $request, ClassModel $class): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $class) {
                foreach ($validated['children_ids'] as $childId) {
                    $child = Child::find($childId);

                    // --- LOGIKA PEMBUATAN QR CODE ---
                    // Cek jika anak belum memiliki QR code
                    if (empty($child->qr_code)) {
                        try {
                            $child->generateUniqueQrCode();
                        } catch (Throwable $e) {
                            throw new \Exception("Failed to generate QR code for child ID {$child->id}: " . $e->getMessage());
                        }
                    }

                    $child->class_id = $class->id;
                    $child->is_active = true;
                    $child->save();
                }
            });
        } catch (Throwable $e) {
            return back()->with('error', 'An error occurred. No children were enrolled.');
        }

        return to_route('admin.class.show', $class->id)->with('success', 'Children enrolled successfully.');
    }

    public function unenroll(ClassModel $class, Child $child): RedirectResponse
    {
        if ($child->class_id !== $class->id) {
            return back()->with('error', 'This child is not in the specified class.');
        }

        $child->class_id = null;
        $child->is_active = false;
        $child->save();

        return to_route('admin.class.show', $class->id)->with('success', 'Child has been unenrolled successfully');
    }
}
