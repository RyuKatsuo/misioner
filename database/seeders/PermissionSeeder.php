<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissionsSuperadmin = [
            'admin.period.view_list',
            'admin.period.create',
            'admin.period.edit',
            'admin.period.delete',
            'admin.period.show',

            'admin.class.view_list',
            'admin.class.create',
            'admin.class.edit',
            'admin.class.delete',
            'admin.class.show',

            'admin.class.enroll',
            'admin.class.unenroll',
            'admin.class.graduate',
            'admin.class.ungraduate',

            'admin.user.view_list',
            'admin.user.create',
            'admin.user.send_password',
            'admin.user.delete',

            'admin.session.view_list',
            'admin.session.create',
            'admin.session.show',
            'admin.session.edit',
            'admin.session.delete',

            'admin.session.attendance',

            'admin.children.view_list',
            'admin.children.edit',
            'children.show',

            'admin.task.view_list',
            'admin.task.create',
            'admin.task.show',
            'admin.task.edit',
            'admin.task.score.update',
            'admin.task.delete',



        ];

        $permissionsManagement = [
            'admin.period.view_list',
            'admin.period.create',
            'admin.period.edit',
            'admin.period.show',

            'admin.class.view_list',
            'admin.class.create',
            'admin.class.edit',
            'admin.class.delete',
            'admin.class.show',

            'admin.class.enroll',
            'admin.class.unenroll',
            'admin.class.graduate',
            'admin.class.ungraduate',

            'admin.user.view_list',
            'admin.user.create',
            'admin.user.send_password',
            'admin.user.delete',

            'admin.session.view_list',
            'admin.session.show',
            'admin.session.delete',

            'admin.children.view_list',
            'children.show',



            'admin.task.view_list',
            'admin.task.show',

        ];

        $permissionsTeacher = [
            'admin.period.view_list',
            'admin.period.show',

            'admin.class.view_list',
            'admin.class.show',

            'admin.user.view_list',

            'admin.session.view_list',
            'admin.session.create',
            'admin.session.show',
            'admin.session.edit',
            'admin.session.delete',

            'admin.session.attendance',

            'admin.children.view_list',
            'children.show',
            
            'admin.task.view_list',
            'admin.task.create',
            'admin.task.show',
            'admin.task.edit',
            'admin.task.score.update',
            'admin.task.delete',



        ];

        $permissionsParent = [
            'children.show',
            'children.view_list',
            'children.create',

        ];

        foreach ($permissionsSuperadmin as $permission) {
            Permission::updateOrCreate(['name' => $permission, 'guard_name' => 'admin']);
        }

        foreach ($permissionsParent as $permission) {
            Permission::updateOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $roleAdmin = Role::updateOrCreate(['name' => 'Superadmin', 'guard_name' => 'admin']);
        $roleAdmin->syncPermissions($permissionsSuperadmin);

        $roleManagement = Role::updateOrCreate(['name' => 'Management', 'guard_name' => 'admin']);
        $roleManagement->syncPermissions($permissionsManagement);

        $roleTeacher = Role::updateOrCreate(['name' => 'Teacher', 'guard_name' => 'admin']);
        $roleTeacher->syncPermissions($permissionsTeacher);

        $roleParent = Role::updateOrCreate(['name' => 'Parent', 'guard_name' => 'web']);
        $roleParent->syncPermissions($permissionsParent);
    }
}
