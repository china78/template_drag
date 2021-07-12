export type CommonBackLayout<T> = {
    data?: T[];
    digestLog?: string;
    digetValues?: any[];
    extendInfo?: any;
    message?: any;
    needRetry?: boolean;
    pageIndex?: number;
    pageSize?: number;
    status?: number;
    totalCount?: number;
}
// 要素大类-出参
export type ElementTypeOut = {
    attributes: any;
    code: string;
    collection: boolean
    description: any;
    name: string;
    nullAble: boolean;
    objectType: any;
    rolePropertys: any;
    seq: any;
    specId: string;
    visiable: boolean;
}
// 要素名称入参
export type ElementNameInt = {
    roleSpecId: string;
}
// 要素名称出参
export type ElementNameOut = {
    code: string;
    dataType: number;
    dataTypeOrigin: string;
    name: string;
    nullAble: boolean;
    propertySpecId: string;
    roleCode: any;
    roleSpecId: string;
    uuid: string;
    visiable: boolean;
}
// 批单-出参
export type OriginCasOut = {
    dataType: string;
    elemCd: string;
    elemName: string;
    elemPath: string;
    elemPathName: string;
    endorseApplyFactorList?: OriginCasOut[];
    id: number;
    parElemCd: string;
}
// 显示格式-入参
export type ShowFormatInt = {
    dataType: string;
    elemCd: string;
}
// 显示格式-出参
export type ShowFormatOut = {
    dataType: string;
    displayFormat: string;
    rmk: string;
}