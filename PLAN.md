
## parseBody

* Takes request body and boundary
* parses the body and returns following

  [
    {
      header: {},
      value: <Buffer>
    },
    ....,
  ]

  header = {
    'Content-Desposition':'',
    'name': 'name of the field',
    ...,
  }

## parseBodyBlock

* used by parseBody
* parses each block
  * parses the raw header


## parseHead

* used by parseBodyBlock
* parses rawHeader