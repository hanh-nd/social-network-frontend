import { IBodyResponse, IFile } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class FileApiService extends ApiService {
    async upload(formData: FormData): Promise<IBodyResponse<IFile[]>> {
        return await this.client.post(`${this.baseUrl}/upload`, formData);
    }
}
const fileApiService = new FileApiService({ baseUrl: '/files' }, axiosService);

export default fileApiService;
