<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GraduateChildrenRequest;
use App\Models\Child;
use App\Models\ClassModel;
use App\Models\Graduate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class GraduateChildrenController extends Controller
{
    public function showGraduateForm(Request $request, ClassModel $class): Response
    {
        // dd($request->input('search'));
        $childrenToGraduate = Child::with('parent')
            ->where('is_active', true)
            ->where('class_id', $class->id)
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
            ->get(['id', 'name', 'parent_id', 'special_needs_status', 'special_needs_description', 'gender']);

        return Inertia::render('admin/class/graduate', [
            'childrenToGraduate' => $childrenToGraduate,
            'filters' => $request->only(['search']),
            'class' => $class
        ]);
    }

    public function store(GraduateChildrenRequest $request, ClassModel $class): RedirectResponse
    {
        $validated = $request->validated();
        try {
            DB::transaction(function () use ($validated) {
                foreach ($validated['children_ids'] as $childId) {
                    $child = Child::find($childId);

                    if (!$child || !$child->is_active) {
                        throw new \Exception("Child with ID $childId is not valid for graduation.");
                    }

                    Graduate::create([
                        'children_id' => $child->id,
                        'graduated_at' => now()
                    ]);

                    $child->is_active = false;
                    $child->save();
                }
            });
        } catch (\Throwable $th) {
            return back()->with('error', 'An Error occurred while graduating children. No changes were made.');
        }
        return to_route('admin.class.show', $class->id)->with('success', 'Children graduated successfully.');
    }

    public function ungraduate(Child $child): RedirectResponse
    {
        try {
            DB::transaction(function () use ($child) {
                $graduateRecord = Graduate::where('children_id', $child->id)->first();
                if(!$graduateRecord){
                    throw new \Exception('This child is not graduate');
                }

                $graduateRecord->delete();
                $child->is_active = true;
                $child->save();
            });
        } catch (\Throwable $th) {
            return back()->with('error', 'Failed to ungraduate child. Please try again.');
        }
         return back()->with('success', 'Child has been ungraduated and is now inactive.');
    }
}
