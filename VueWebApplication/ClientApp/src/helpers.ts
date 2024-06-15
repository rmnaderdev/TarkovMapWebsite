
export const tryGetErrorMessage = async (response: Response): Promise<{ message: string } | null> => {
    try {
        return await response.json() as { message: string } | null;
    } catch (error) {
        return null;
    }
};