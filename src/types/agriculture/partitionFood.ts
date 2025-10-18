import {BaseArrayResult, BaseObjectResult, BasePageResult} from '../axios'

export interface AgriculturePartitionFoodResult {
                id: string,
                iaPartitionId: string,
                weight: string,
                name: string,
                date: string,
                description: string,
                status: string
}

export type AgriculturePartitionFoodListPageResult = BasePageResult<AgriculturePartitionFoodResult>
export type AgriculturePartitionFoodListResult = BaseArrayResult<AgriculturePartitionFoodResult>
export type AgriculturePartitionFoodInfoResult = BaseObjectResult<AgriculturePartitionFoodResult>

