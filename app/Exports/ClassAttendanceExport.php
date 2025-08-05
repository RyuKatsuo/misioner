<?php

namespace App\Exports;

use App\Models\ClassModel;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ClassAttendanceExport implements FromArray, WithHeadings, ShouldAutoSize, WithStyles
{
    protected $class;
    protected $sessions;
    protected $children;
    protected $data;

    public function __construct(ClassModel $class)
    {
        $this->class = $class;
        // Ambil semua sesi untuk kelas ini, diurutkan berdasarkan tanggal
        $this->sessions = $class->sessions()->orderBy('session_date')->get();
        // Ambil semua anak, dan muat semua catatan kehadiran mereka sekaligus (Eager Loading)
        $this->children = $class->childrens()->with('attendances')->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        // Header pertama adalah 'Nama Anak'
        $headings = ['Nama Anak'];

        // Tambahkan setiap tanggal sesi sebagai header kolom
        foreach ($this->sessions as $session) {
            $headings[] = $session->session_date->format('d M Y');
        }

        return $headings;
    }

    /**
     * @return array
     */
    public function array(): array
    {
        $data = [];

        // Loop untuk setiap anak untuk membuat baris data
        foreach ($this->children as $child) {
            $rowData = [$child->name]; // Kolom pertama di setiap baris adalah nama anak

            // Loop untuk setiap sesi untuk mengisi status kehadiran
            foreach ($this->sessions as $session) {
                // Cari catatan kehadiran anak untuk sesi ini
                $attendance = $child->attendances->firstWhere('session_id', $session->id);
                // Jika ada, tulis statusnya. Jika tidak, tulis 'N/A'.
                $rowData[] = $attendance ? $attendance->status->value : 'N/A';
            }
            $data[] = $rowData;
        }

        $this->data = $data; // Simpan data untuk digunakan di method styles()
        return $data;
    }

    /**
     * Menerapkan style (pewarnaan) pada sel.
     */
    public function styles(Worksheet $sheet)
    {
        // Atur warna header
        $sheet->getStyle('1')->getFont()->setBold(true);

        // Loop melalui data untuk menerapkan warna pada setiap sel status
        foreach ($this->data as $rowIndex => $rowData) {
            foreach ($rowData as $colIndex => $cellValue) {
                if ($colIndex > 0) { // Lewati kolom nama anak
                    $cellCoordinate = chr(65 + $colIndex) . ($rowIndex + 2);
                    $color = '';

                    switch ($cellValue) {
                        case 'Present':
                            $color = 'FFFF00'; // Kuning
                            break;
                        case 'Late':
                            $color = 'ADD8E6'; // Biru Muda
                            break;
                        case 'Absent':
                            $color = 'FFC7CE'; // Merah Muda
                            break;
                    }

                    if ($color) {
                        $sheet->getStyle($cellCoordinate)->getFill()
                            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                            ->getStartColor()->setARGB($color);
                    }
                }
            }
        }
    }
}
