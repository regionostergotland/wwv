let diastolicDataType = new DataTypeQuantity(
  {
    path: 'any_event',
    label: 'Diastoliskt',
    description: `Det minsta systemiskt arteriella blodtrycket uppmätt
    diastoliskt eller i hjärtcykelns avslappningsfas.`,
    required: true,
    single: false,
    visible: true,
  }, 'mm[Hg]', 0, 1000
)
