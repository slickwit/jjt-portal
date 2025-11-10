<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    public function index() {
        return Inertia::render('assessments/list/page');
    }

    public function show() {
        return Inertia::render('assessments/detail/page');
    }

    public function create() {
        return Inertia::render('assessments/create/page');
    }
}
