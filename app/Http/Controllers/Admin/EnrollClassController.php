<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EnrollChildrenRequest;
use App\Models\Child;
use App\Models\ClassModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
            'filters' => $request->only(['search'])
        ]);
    }

    public function enroll(EnrollChildrenRequest $request, ClassModel $class): RedirectResponse
    {
        $validated = $request->validated();

        foreach ($validated['children_ids'] as $childId) {
            $child = Child::find($childId);
            $child->class_id = $class->id;
            $child->is_active = true;
            $child->save();
        }

        return to_route('admin.class.show', $class->id)->with('success', 'Children enroll successfully.');
    }

    public function unenroll(ClassModel $class, Child $child): RedirectResponse
    {
        if($child->class_id !== $class->id){
            return back()->with('error', 'This child is not in the specified class.');
        }

        $child->class_id = null;
        $child->is_active = false;
        $child->save();

        return to_route('admin.class.show', $class->id)->with('success', 'Child has been unenrolled successfully');
    }
}
