<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTaskRequest;
use App\Http\Requests\Admin\UpdateTaskRequest;
use App\Models\Child;
use App\Models\ClassModel;
use App\Models\Score;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $query = Task::with(['classModel', 'admin'])
            ->when($request->input('search'), function ($q, $search) {
                $q->where('task', 'ilike', "%{$search}%")
                    ->orWhereHas('classModel', function ($subq) use ($search) {
                        $subq->where('class_name', 'ilike', "%{$search}%");
                    });
            });

        if (!$user->hasRole(['Superadmin', 'Management'])) {
            $query->where('admin_id', $user->id);
        }

        $tasks = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/task/index', [
            'tasks' => $tasks,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $classes = ClassModel::whereHas('period', fn($q) => $q->where('is_active', true))
            ->get(['id', 'class_name']);
        return Inertia::render('admin/task/create', ['classes' => $classes]);
    }

    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['admin_id'] = Auth::id();
        Task::create($data);
        return to_route('admin.tasks.index')->with('success', 'Task created successfully.');
    }

    public function show(Task $task): Response
    {
        $task->load([
            'classModel.childrens' => function ($query) {
                $query->orderBy('name', 'asc');
            },
            'classModel.childrens.scores' => function ($query) use ($task) {
                $query->where('task_id', $task->id);
            }
        ]);
        return Inertia::render('admin/task/show', ['task' => $task]);
    }

    public function edit(Task $task): Response
    {
        $classes = ClassModel::whereHas('period', fn($q) => $q->where('is_active', true))
            ->get(['id', 'class_name']);
        return Inertia::render('admin/task/edit', [
            'task' => $task,
            'classes' => $classes
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $task->update($request->validated());
        return to_route('admin.tasks.index')->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task): RedirectResponse
    {
        $task->delete();
        return to_route('admin.tasks.index')->with('success', 'Task deleted successfully.');
    }

    public function updateScores(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'scores' => ['required', 'array'],
            'scores.*.child_id' => ['required', 'uuid', 'exists:childrens,id'],
            'scores.*.score' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);

        foreach ($validated['scores'] as $scoreData) {
            if (!is_null($scoreData['score'])) {
                Score::updateOrCreate(
                    [
                        'task_id' => $task->id,
                        'children_id' => $scoreData['child_id'],
                    ],
                    [
                        'score' => $scoreData['score'],
                    ]
                );
            }
        }

        $childrenIds = array_column($validated['scores'], 'child_id');
        $childrenToUpdate = Child::findMany($childrenIds);
        foreach ($childrenToUpdate as $child) {
            $child->recalculateTotalScore();
        }

        return to_route('admin.tasks.show', $task->id)->with('success', 'Scores updated successfully.');
    }
}
