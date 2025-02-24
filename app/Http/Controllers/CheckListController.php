<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Inertia\{ Inertia, Response as InertiaResponse};
use Illuminate\Http\Request;

class CheckListController extends Controller
{
    public function getPunchList(): InertiaResponse {
        return Inertia::render("CheckListForms/PunchList");
    }

    public function storePunchList(Request $request) {
        DB::table('checklist')
            ->updateOrInsert(
                ['id' => 1],
                ['state' => $request->getContent()]
            );
        return response(['message' => 'data saved', 'status' => 200])->header('Content-Type', 'application/json');
    }

    public function getPunchListData() {
        $data = DB::table('checklist')->where('id', 1)->first();
        $dataState = $data ? json_decode($data->state) : null;
        return response(['state' => $dataState], 200)
            ->header('Content-Type', 'application/json');
    }

    public function generatePunchListPendingTasksPDF(Request $request) {
        $data = $request->all();
        $processedData = transformNullsToEmptyStrings($data['formState']);
        DB::table('checklist')
            ->updateOrInsert(
                ['id' => 1],
                ['state' => json_encode($processedData)]
            );

        $pdf = Pdf::loadView(
            'pdf.aqua-reserve-pending-task-template',
            [
                'data' => $data['formStateAsArray'],
                'dataCollection' => $data['formState'],
            ]
        );

        return response()->streamDownload(
            fn () => print($pdf->output()),
            'current_config.pdf',
            ['Content-Type' => 'application/pdf']
        );
    }
}
