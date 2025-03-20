export type EmployeeBody = {
    name: string;
    email: string;
    department_id?: number;
    manager_id?: number;
};

export type attendanceBody = {
    check_in: string;
    check_out: string;
    employee_id: number;
}

export type employeedProject = {
    employee_id: number;
    project_id: number;
}