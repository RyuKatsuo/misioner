<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreChildRequest;
use App\Models\Child;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Encoders\AutoEncoder;
use Intervention\Image\Laravel\Facades\Image;

class ChildController extends Controller
{
    public function index(): Response
    {

        $children = Auth::user()
            ->childrens()
            ->with(['classModel', 'graduate'])
            ->latest()
            ->get();

        return Inertia::render('user/children/index', [
            'children' => $children
        ]);
    }


    public function create(): Response
    {
        return Inertia::render('user/children/create');
    }

    public function show(Child $child): Response
    {
        $child->load(['scores.task', 'parent', 'classModel.period', 'attendances']);

        return Inertia::render('admin/children/show', [
            'child' => $child
        ]);
    }

    public function store(StoreChildRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            
            $image = $request->file('avatar');
            $filename = uniqid() . '.' . $image->getClientOriginalExtension();
            $path = 'avatars/children/' . $filename;

            $sizeInKb = $image->getSize() / 1024;

            $imageContent;

            if ($sizeInKb > 512) {
                $imageContent = Image::read($image)->encode(new AutoEncoder(quality: 75));
            } else {
                $imageContent = file_get_contents($image->getRealPath());
            }

            Storage::disk('public')->put($path, $imageContent);

            $data['avatar_url'] = $path;
        }

        $data['parent_id'] = Auth::id();
        Child::create($data);

        return to_route('children.index')->with('success', 'Child added successfully.');
    }

    public function downloadIdCard(Child $child)
    {
        $child->load('classModel');

        $qrCodePath = $child->qr_url ? Storage::disk('public')->path($child->qr_url): null;
        $avatarPath = $child->avatar_url ? Storage::disk('public')->path($child->avatar_url): null;

        $data = [
            'child' => $child,
            'avatarBase64' => $avatarPath,
            'qrCodeBase64' => $qrCodePath,
        ];

        $filename = 'ID Card - '. $child->name . '.pdf';
        $pdf = Pdf::loadView('pdf.id_card', $data);

        return $pdf->download($filename);
    }
}
