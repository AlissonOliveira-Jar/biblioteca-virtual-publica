import api from "./api";
import type { ReportCreateDTO, ReportDTO } from "../types/report.ts";

const createReport = async (data: ReportCreateDTO) => {
    await api.post('/reports', data);
};

const getPendingReports = async (): Promise<ReportDTO[]> => {
    const res = await api.get<ReportDTO[]>('/reports/admin');
    return res.data;
};

const resolveReport = async (reportId: string, action: string, duration?: string) => {
    const params: any = { action };
    if (duration) {
        params.duration = duration;
    }
    await api.post(`/reports/admin/${reportId}/resolve`, null, { params });
};

export const reportService = {
    createReport,
    getPendingReports,
    resolveReport
};