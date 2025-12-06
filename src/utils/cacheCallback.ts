import { queryClient } from "./queryClient";

export function cachedCallback<TParams extends any[], TResult>(
    queryKeyFn: (...params: TParams) => any[],
    queryFn: (...params: TParams) => Promise<TResult>,
    options?: {
        staleTime?: number;
        gcTime?: number;
    }
) {

    const callback = async (...params: TParams): Promise<TResult> => {
        const key = queryKeyFn(...params);
        console.log("cachedCallback key:", key);

        // 1️⃣ Check cache
        const cached = queryClient.getQueryData<TResult>(key);
        if (cached) return cached;

        // 2️⃣ Call real API
        const result = await queryFn(...params);

        // 3️⃣ Save cache & apply staleTime + gcTime
        queryClient.setQueryData<TResult>(key, result, {

            // staleTime: options?.staleTime ?? 5 * 60 * 1000, // default 5 minutes
            // cacheTime: options?.gcTime ?? 30 * 60 * 1000, // default 30 minutes
        });


        if (options?.staleTime !== undefined || options?.gcTime !== undefined) {
            queryClient.setQueryDefaults(key, {
                staleTime: options.staleTime,
                gcTime: options.gcTime,
            });
        }

        return result;
    };

    return callback;
}

