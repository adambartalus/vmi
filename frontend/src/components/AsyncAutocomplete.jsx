import { useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';

const AsynchronousAutocomplete = ({
  fetchOptions,
  sortOptions,
  TextFieldProps,
  getOptionLabel,
  label,
  queryKey,
  value,
  onChange,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const { isLoading, data, error, refetch } = useQuery(queryKey, fetchOptions);

  useEffect(() => {
    if (!open) return setOptions([]);
    if (!isLoading) setOptions(data);
    refetch();
  }, [open, data, refetch, isLoading]);

  useEffect(() => {
    if (data) setOptions(data);
  }, [data]);

  return (
    <Autocomplete
      noOptionsText={error ? 'There was an error' : 'No options'}
      openOnFocus
      fullWidth
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={sortOptions ? options.sort(sortOptions) : options}
      loading={isLoading}
      getOptionLabel={getOptionLabel}
      onChange={onChange}
      value={value}
      renderInput={(params) => (
        <TextField
          label={label}
          {...params}
          {...TextFieldProps}
          InputProps={{
            ...params?.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params?.InputProps?.endAdornment}
              </>
            ),
            ...TextFieldProps?.InputProps,
          }}
        />
      )}
      {...props}
    />
  );
};
export default AsynchronousAutocomplete;
