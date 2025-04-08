
import SearchFormReset from './SearchFormReset';
import {Search} from 'lucide-react'

const SearchForm = ({query}: {query?: string}) => {
  return (
    <form action='/' className='search-form' >
      <input
        name='query'
        value={query}
        className='search-input !text-black-200'
        placeholder='search travel stories'
      />
      <div className='flex gap-2'>
      {query && <SearchFormReset />}
      <button type='submit' className='search-btn'>
        <Search />
      </button>
      </div>
    </form>
  );
};

export default SearchForm;
