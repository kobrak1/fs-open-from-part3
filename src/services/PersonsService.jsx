import axios from 'axios'

// this is a relative url that helps to reach the ui content at the same address both backend and frontend
const baseUrl = '/api/persons';

const getAll = () => {
  return axios.get(baseUrl)
      .catch(() => {
      console.log('fail')
    })
}

const create = (newObject) => {
  return axios.post(baseUrl, newObject)
  .catch(() => {
    console.log('fail')
  })
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then((response) => response.data)
    .catch(() => {
      console.log('fail')
    })
};
const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
  .catch(() => {
    console.log('fail')
  })
}

export default { 
  getAll, 
  create,
  remove ,
  update
}