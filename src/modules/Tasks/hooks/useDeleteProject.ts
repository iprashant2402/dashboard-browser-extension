import { useMutation } from "@tanstack/react-query"
import { localProjectRepository } from "../repository/ProjectRepository";
export const useDeleteProject = (props: { onSuccess: () => void }) => {
    return useMutation({
        mutationFn: (id: string) => {
            return localProjectRepository.deleteProject(id);
        },
        onSuccess: props?.onSuccess
    });
}