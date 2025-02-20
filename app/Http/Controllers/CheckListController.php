<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\{ Inertia, Response as InertiaResponse};
use Illuminate\Http\Request;

class CheckListController extends Controller
{
    public function getPunchList(): InertiaResponse {
        return Inertia::render("CheckListForms/PunchList");
    }

    public function storePunchList(Request $request) {
        $data = $request->all();
        DB::table('checklist')
            ->updateOrInsert(
                ['id' => 1],
                ['state' => $request->getContent()]
            );
        return response(['response' => "good", 'status' => 200])->header('Content-Type', 'application/json');
    }

    public function getPunchListData() {
        $data = DB::table('checklist')->where('id', 1)->first();
        $dataState = $data ? json_decode($data->state) : [];
        return response(['state' => $dataState], 200)
            ->header('Content-Type', 'application/json');
    }
}
