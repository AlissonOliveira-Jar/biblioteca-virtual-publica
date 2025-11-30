import api from "./api";
import type {ReportCreateDTO, ReportDTO} from "../types/report.ts";

const createReport = async (data: ReportCreateDTO) => {
    await api.post('/reports', data);
};

// Agora o TypeScript sabe que isso retorna um array de ReportDTO!
const getPendingReports = async (): Promise<ReportDTO[]> => {
    const res = await api.get<ReportDTO[]>('/reports/admin');
    return res.data;
};

const resolveReport = async (reportId: string, action: string) => {
    await api.post(`/reports/admin/${reportId}/resolve`, null, {
        params: { action }
    });
};

export const reportService = {
    createReport,
    getPendingReports,
    resolveReport
};