package de.convit.microservice.amsintegrator.domain.port.out;

import de.convit.microservice.amsintegrator.domain.model.AMSProvider;
import de.convit.microservice.amsintegrator.domain.model.ExternalAsset;
import de.convit.microservice.amsintegrator.domain.model.SearchQuery;
import io.vavr.control.Try;

import java.util.List;

public interface AMSProviderAdapter {
    Try<List<ExternalAsset>> search(SearchQuery query);

    Try<ExternalAsset> findAssetDetailsById(AMSProvider provider, String assetId);
}
