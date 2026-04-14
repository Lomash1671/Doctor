export const dummyDoctors = [
  { _id: 'd1', name: 'Dr. Sarah Smith', specialization: 'Cardiology', email: 'sarah@medcare.com', phone: '1234567890' },
  { _id: 'd2', name: 'Dr. James Wilson', specialization: 'Neurology', email: 'james@medcare.com', phone: '0987654321' },
];

export const dummyPatients = [
  { _id: 'p1', name: 'John Doe', age: 34, gender: 'Male', email: 'john@gmail.com', phone: '1112223333', address: '123 Main St' },
  { _id: 'p2', name: 'Jane Miller', age: 28, gender: 'Female', email: 'jane@gmail.com', phone: '4445556666', address: '456 Oak Ave' },
];

export const dummyVisits = [
  { _id: 'v1', patient: dummyPatients[0], doctor: dummyDoctors[0], reason: 'Regular Checkup', status: 'Scheduled', date: new Date().toISOString() },
];

function updateArray(arr, id, newItem) {
  const index = arr.findIndex(item => item._id === id);
  if (index !== -1) {
    arr[index] = { ...arr[index], ...newItem };
  }
}

function deleteFromArray(arr, id) {
  const index = arr.findIndex(item => item._id === id);
  if (index !== -1) arr.splice(index, 1);
}

export const setDummyDoctor = (doc) => {
  if (doc._id) updateArray(dummyDoctors, doc._id, doc);
  else dummyDoctors.push({ ...doc, _id: Date.now().toString() });
}
export const delDummyDoctor = (id) => deleteFromArray(dummyDoctors, id);

export const setDummyPatient = (pat) => {
  if (pat._id) updateArray(dummyPatients, pat._id, pat);
  else dummyPatients.push({ ...pat, _id: Date.now().toString() });
}
export const delDummyPatient = (id) => deleteFromArray(dummyPatients, id);

export const setDummyVisit = (vis) => {
  const populatedVisit = {
    ...vis,
    patient: dummyPatients.find(p => p._id === vis.patient) || vis.patient,
    doctor: dummyDoctors.find(d => d._id === vis.doctor) || vis.doctor,
  };
  if (vis._id) updateArray(dummyVisits, vis._id, populatedVisit);
  else dummyVisits.push({ ...populatedVisit, _id: Date.now().toString() });
}
export const delDummyVisit = (id) => deleteFromArray(dummyVisits, id);
