import { ProblemDetail } from "@/server/types/domain";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export interface ServerResponse<D> {
  data?: D;
  error?: ProblemDetail;
}

export async function fetcherResponseHandlerV2<D>(
  fetcher: Promise<ServerResponse<unknown>>,
  expectData?: "EXPECT_DATA"
): Promise<APIResult<D, ProblemDetail>> {
  const resultAsync = await ResultAsync.fromPromise(fetcher, (e) => {
    const unknownError: ProblemDetail = {
      status: 500,
      title: (e as Error).name ?? "Internal Server Error",
      detail:
        (e as Error).message ??
        "An unexpected error occurred while processing the request.",
      type: "https://httpstatuses.com/500",
      instance: "https://httpstatuses.com/500",
    };
    return unknownError;
  }).andThen((response) => {
    if (response.error) {
      return errAsync<D, ProblemDetail>(response.error);
    }
    if (expectData && !response.data) {
      const errorPayload: ProblemDetail = {
        status: 422,
        title: "Unprocessable Content",
        detail: "The response did not contain any data as expected.",
        type: "https://httpstatuses.com/422",
        instance: "https://httpstatuses.com/422",
      };
      return errAsync<D, ProblemDetail>(errorPayload);
    }
    return okAsync<D, ProblemDetail>(response.data as D);
  });

  if (resultAsync.isErr()) {
    return {
      data: null,
      error: resultAsync.error,
    };
  } else {
    return {
      data: resultAsync.value,
      error: null,
    };
  }
}

export async function fetcherResponseHandler<D>(
  fetcher: () => Promise<ServerResponse<unknown>>,
  expectData?: "EXPECT_DATA"
): Promise<ServerResponse<D>> {
  try {
    const { data, error } = await fetcher();
    if (error) {
      return { error };
    }

    if (expectData && !data) {
      return {
        error: {
          status: 422,
          title: "Unprocessable Content",
          detail: "The response did not contain any data as expected.",
          type: "https://httpstatuses.com/422",
          instance: "https://httpstatuses.com/422",
          violations: {},
        },
      };
    }
    return {
      data: data as D,
    } satisfies ServerResponse<D>;
  } catch (e) {
    console.log("error ", e);
    return {
      error: {
        status: 500,
        title: (e as Error).name ?? "Internal Server Error",
        detail:
          (e as Error).message ??
          "An unexpected error occurred while processing the request.",
        type: "https://httpstatuses.com/500",
        instance: "https://httpstatuses.com/500",
        violations: {},
      },
    };
  }
}

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type APIResult<T, E = Error> = Success<T> | Failure<E>;
