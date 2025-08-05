<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ClassAttendanceExport;
use App\Http\Controllers\Controller;    
use App\Http\Requests\Admin\StoreClassRequest;
use App\Http\Requests\Admin\UpdateClassRequest;
use App\Models\ClassModel;
use App\Models\Period;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ClassController extends Controller
{
    public function index(Request $request)
    {
        $classes = ClassModel::query()
            ->with('period')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('class_name', 'ilike', "%{$search}%")
                    ->orWhereHas('period', function ($subQuery) use ($search) {
                        $subQuery->where('name', 'ilike', "%{$search}%");
                    });
            })
            ->latest('created_at')
            ->paginate(10)
            ->withQueryString();
        // dd($classes);
        return Inertia::render('admin/class/index', [
            'classes' => $classes,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        $periods = Period::latest()->get(['id', 'name']);
        return Inertia::render('admin/class/create', [
            'periods' => $periods
        ]);
    }

    public function store(StoreClassRequest $request): RedirectResponse
    {
        ClassModel::create($request->validated());

        return to_route('admin.class.index')->with('success', 'Class created successfully.');
    }

    public function edit(ClassModel $class): Response
    {
        $periods = Period::latest()->get(['id', 'name']);
        return Inertia::render('admin/class/edit', [
            'class' => $class,
            'periods' => $periods
        ]);
    }

    public function update(UpdateClassRequest $request, ClassModel $class): RedirectResponse
    {
        $class->update($request->validated());
        return to_route('admin.class.index')->with('success', 'Class updated successfully.');
    }

    public function show(ClassModel $class)
    {
        $class->load(['period', 'childrens.graduate',]);

        $classWithStats = $class->loadCount([
            'childrens as total_children',
            'childrens as total_boys' => function ($query) {
                $query->where('gender', 'Male');
            },
            'childrens as total_girls' => function ($query) {
                $query->where('gender', 'Female');
            },
            'childrens as total_special_needs' => function ($query) {
                $query->where('special_needs_status', true);
            },
        ]);

        return Inertia::render('admin/class/show', [
            'class' => $classWithStats,
        ]);
    }

    public function destroy(ClassModel $class): RedirectResponse
    {
        $class->delete();
        return to_route('admin.class.index')->with('success', 'Class has been deleted.');
    }

    public function exportAttendance(ClassModel $class)
    {
        // Buat nama file yang dinamis
        $fileName = 'Rekap Kehadiran - ' . $class->class_name . ' - ' . now()->format('Y-m-d') . '.xlsx';
        
        // Panggil kelas Export dan unduh filenya
        return Excel::download(new ClassAttendanceExport($class), $fileName);
    }
}
