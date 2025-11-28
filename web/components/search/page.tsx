    // components/SearchInput.jsx
    import { useSearchParams, usePathname, useRouter } from 'next/navigation';
    import { useDebouncedCallback } from 'use-debounce';

    export default function SearchInput() {
      const searchParams = useSearchParams();
      const pathname = usePathname();
      const { replace } = useRouter();

      const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
          params.set('query', term);
        } else {
          params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
      }, 300); // Debounce delay of 300 milliseconds

      return (
        <input
          type="text"
          className="w-70 ml-3 border p-2 border-gray-300 rounded-lg shadow-sm bg-white text-ls outline-none"
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
        />
      );
    }