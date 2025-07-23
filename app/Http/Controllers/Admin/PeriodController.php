<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePeriodRequest;
use App\Http\Requests\Admin\UpdatePeriodRequest;
use App\Models\Period;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PeriodController extends Controller
{
    public function index(Request $request)
    {
        $periods = Period::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'ilike', "%{$search}%");
            })
            ->latest('created_at')
            ->paginate(10)
            ->withQueryString();
        // dd($request->input('search'));
        // dd($periods);

        return Inertia::render('admin/period/index', [
            'periods' => $periods,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render("admin/period/create", [
            'hasActivePeriod' => Period::where('is_active', true)->exists()
        ]);
    }

    public function store(StorePeriodRequest $request): RedirectResponse
    {
        Period::create($request->validated());

        return to_route('admin.period.index')->with('success', 'Period created successfully.');
    }

    public function edit(Period $period): Response
    {
        return Inertia::render('admin/period/edit', [
            // Kirim data periode sebagai array, bukan sebagai objek Eloquent langsung
            'period' => [
                'id' => $period->id,
                'name' => $period->name,
                'start_date' => $period->start_date->format('Y-m-d'),
                'end_date' => $period->end_date->format('Y-m-d'),
                'is_active' => $period->is_active,
            ],
            'hasOtherActivePeriod' => Period::where('is_active', true)->where('id', '!=', $period->id)->exists(),
        ]);
    }

    public function update(UpdatePeriodRequest $request, Period $period): RedirectResponse
    {
        // dd($period);
        $period->update($request->validated());

        return to_route('admin.period.index')->with('success', 'Period updated successfully.');
    }
}
