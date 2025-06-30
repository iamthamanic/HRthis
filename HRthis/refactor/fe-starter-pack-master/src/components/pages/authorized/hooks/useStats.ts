import { SampleService } from "@/components/services/sample/sample.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type UseStatsProps =
  | {
      onSuccess?: (data: any) => void;
      onError?: (error: Error) => void;
    }
  | undefined;

// ÖRNEK HOOKTUR, KENDİ HOOKLARINIZI KULLANABİLİRSİNİZ

export const useStats = ({ onSuccess, onError }: UseStatsProps = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stats"],
    queryFn: () => SampleService.getHomePageStats(),
  });

  if (error) {
    toast.error(error.message);
    onError?.(error as Error);
  }

  if (data) {
    toast.success("Stats loaded successfully");
    onSuccess?.(data);
  }

  return { data, isLoading };
};
