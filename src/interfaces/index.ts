export type CreateUserFields = {
    firstName?: string[],
    lastName?: string[],
    email?: string[],
}

export type CreateUserFiles = {
    profilePhoto?: UploadedFileType[],
}

export type UploadedFileType = {
    fieldName: string,
    originalFilename: string,
    path: string,
    headers: Record<string, string>,
    size: number
}

export type UserProfile = {
    id: string,
    profilePhoto: string,
    firstName: string,
    lastName: string,
    email: string
}