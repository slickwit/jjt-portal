<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Examinee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date_of_birth',
        'phone',
        'demographic_data',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'demographic_data' => 'array',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // Future relationships (commented for now)
    // public function invitations()
    // {
    //     return $this->hasMany(AssessmentInvitation::class);
    // }
    
    // public function results()
    // {
    //     return $this->hasMany(AssessmentResult::class);
    // }

    // Accessors
    public function getEmailAttribute()
    {
        return $this->user->email;
    }

    public function getNameAttribute()
    {
        return $this->user->name;
    }
}
