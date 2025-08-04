<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateChildRequest;
use App\Models\Child;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ChildrenAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->input('status', 'active');
        $query = Child::query()
            ->with('classModel', 'parent', 'graduate')
            ->when($status === 'active', function ($q) {
                $q->where('is_active', true);
            })
            ->when($status === 'inactive', function ($q) {
                $q->where('is_active', false)->doesntHave('graduate');
            })
            ->when($status === 'graduated', function ($q) {
                $q->where('is_active', false)->has('graduate');
            })
            ->when($request->input('search'), function ($q, $search) {
                $q->where(function ($subq) use ($search) {
                    $subq->where('name', 'ilike', "%{$search}%")
                        ->orWhereHas('parent', function ($parentQuery) use ($search) {
                            $parentQuery->where('name', 'ilike', "%{$search}%");
                        });
                });
            });

        $childrens = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/children/index', [
            'childrens' => $childrens,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function edit(Child $child): Response
    {
        return Inertia::render('admin/children/edit', [
            'child' => $child
        ]);
    }

    public function update(UpdateChildRequest $request, Child $child): RedirectResponse
    {
        $data = $request->validated();

        if($request->hasFile('avatar')){
            Storage::disk('public')->delete($child->avatar_url);
            $data['avatar_url'] = $request->file('avatar')->store('avatars/children', 'public');
        }

        $child->update($data);

        return to_route('children.show', $child->id)->with('success', 'Child data updated.');
    }
}
