<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
     use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'created_by',
        'status',
        'settings',
        'scheduled_at',
        'due_at',
    ];

    protected $casts = [
        'settings' => 'array',
        'scheduled_at' => 'datetime',
        'due_at' => 'datetime',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
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

    // Scopes
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    // Helpers
    public function isDraft()
    {
        return $this->status === 'draft';
    }

    public function isActive()
    {
        return $this->status === 'active';
    }
}
