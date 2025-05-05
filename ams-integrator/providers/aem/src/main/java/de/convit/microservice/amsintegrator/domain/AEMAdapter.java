package de.convit.microservice.amsintegrator.domain;

import de.convit.microservice.amsintegrator.domain.model.AMSProvider;
import de.convit.microservice.amsintegrator.domain.model.ExternalAsset;
import de.convit.microservice.amsintegrator.domain.model.SearchQuery;
import de.convit.microservice.amsintegrator.domain.port.out.AMSProviderAdapter;
import io.vavr.control.Try;
import org.apache.commons.lang3.NotImplementedException;

import java.util.List;

public class AEMAdapter implements AMSProviderAdapter {
    @Override
    public Try<List<ExternalAsset>> search(SearchQuery query) {
        return Try.failure(new NotImplementedException("This method is not implemented yet."));
    }

    @Override
    public Try<ExternalAsset> findAssetDetailsById(AMSProvider provider, String assetId) {
        return Try.failure(new NotImplementedException("This method is not implemented yet."));
    }
}
