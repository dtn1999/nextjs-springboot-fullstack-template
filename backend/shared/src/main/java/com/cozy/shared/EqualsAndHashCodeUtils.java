package com.cozy.shared;

import com.cozy.shared.db.BaseEntity;
import lombok.experimental.UtilityClass;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

/**
 * This class provides utility methods for the equals and hashCode of entity classes.
 * The given implementation is based on the following <a href="https://thorben-janssen.com/lombok-hibernate-how-to-avoid-common-pitfalls/">article</a>.
 * The primary reason for this class is to avoid code duplication while keeping
 * the performance considerations presented in the article mentioned above.
 */
@UtilityClass
public class EqualsAndHashCodeUtils {

    @SuppressWarnings("unchecked")
    public <T extends BaseEntity> boolean checkEquality(T ref, Object object) {
        if (ref == object) return true;
        if (object == null) return false;
        Class<?> oEffectiveClass = object instanceof HibernateProxy hibernateProxy ? hibernateProxy.getHibernateLazyInitializer().getPersistentClass() : object.getClass();
        Class<?> thisEffectiveClass = ref instanceof HibernateProxy hibernateProxy ? hibernateProxy.getHibernateLazyInitializer().getPersistentClass() : ref.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        T other = (T) object;
        return ref.getId() != null && Objects.equals(ref.getId(), other.getId());
    }

    public <T extends BaseEntity> int getHashCode(T ref) {
        return ref instanceof HibernateProxy hibernateProxy ? hibernateProxy.getHibernateLazyInitializer().getPersistentClass().hashCode() : ref.getClass().hashCode();
    }

}
