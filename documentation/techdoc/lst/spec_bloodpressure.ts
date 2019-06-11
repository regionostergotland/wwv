let bloodpressureSpec = {
      id : 'blood_pressure',
      label : 'Blodtryck',
      description : `Den lokala mätningen av artärblodtrycket som är ett
      surrogat för artärtryck i systemcirkulationen.`,
      dataTypes : new Map<string, DataType>([
        ['time', timeDataType],
        ['systolic', systolicDataType],
        ['diastolic', diastolicDataType],
        ['position', positionDataType]
      ])
}
