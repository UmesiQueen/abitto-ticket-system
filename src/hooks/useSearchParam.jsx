import { useSearchParams } from 'react-router-dom'

export const useSearchParam = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const getSearchParams = () => {
        return (searchParams.entries().reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {}))
    }

    // Function to modify a param value
    const updateSearchParam = (key, value) => {
        // Clone the current search params
        const newSearchParams = new URLSearchParams(searchParams);

        if (value) {
            // Set the new value for the specified key
            newSearchParams.set(key, value);

            // Update the URL with the new search params
            setSearchParams(newSearchParams);
        } else removeSearchParam(key)
    };

    const removeSearchParam = (key) => {
        // Clone the current search params
        const newSearchParams = new URLSearchParams(searchParams);

        // Remove the specified key
        newSearchParams.delete(key);

        // Set the updated search parameters
        setSearchParams(newSearchParams);
    };

    return { getSearchParams, updateSearchParam, removeSearchParam }
}

