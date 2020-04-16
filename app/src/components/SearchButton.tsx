import debounce from 'lodash.debounce';

const logEvent = debounce((query, dateStr) => {
    gtag('event', 'onSearch', {
        event_category: query,
        event_label: dateStr
    });
}, 750);
const onSearchDebounced = debounce((onSearch, value, dateStr) => {
    onSearch(value);
    logEvent(value, dateStr);
}, 150);

const SearchButton = ({onSearch, dateStr, tableId = '0'}) => {
    let input;

    const onKeyup = () => {
        const {value} = input;
        onSearchDebounced(onSearch, value, dateStr);
    };

    return (
        <label className="search-label" htmlFor={`search-bar-${tableId}`}>
            <input
                id={`search-bar-${tableId}`}
                className="form-control"
                ref={n => (input = n)}
                type="text"
                onKeyUp={onKeyup}
                aria-label="enter text you want to search"
                placeholder="Search"
            />
        </label>
    );
};

export default SearchButton;
