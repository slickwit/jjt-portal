<?php

use App\Http\Controllers\AssessmentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::redirect('assessment', '/assessment/list');

    Route::get('assessment/list', [AssessmentController::class, 'index'])->name('assessment.index');
    Route::get('assessment/detail/1', [AssessmentController::class, 'show'])->name('assessment.show');
    Route::get('assessment/create', [AssessmentController::class, 'create'])->name('assessment.create');
});
