import {BaseArrayResult, BaseObjectResult, BasePageResult} from '../axios'

export interface AgricultureCropBatchResult {
    batchId: string,
    batchName: string,
    pastureId: string,
    cropArea: string,
    contractAddr: string,
    createTime: string,
    classImage: string,
    className: string,
    nickName: string,
    responsiblePersonId: string,
    germplasmId: string
}

export type AgricultureCropBatchListPageResult = BasePageResult<AgricultureCropBatchResult>
export type AgricultureCropBatchListResult = BaseArrayResult<AgricultureCropBatchResult>
export type AgricultureCropBatchInfoResult = BaseObjectResult<AgricultureCropBatchResult>

