require('dotenv').config()
const superTest = require('supertest')
const baseUrl = process.env.BASEURL
const clientId = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET

describe('POST - Customer Access (Login)', () => {
  test('T01 - Successfull - Should return status 201 and an object containing token and expiresIn.', async () => {
    const response = await superTest(baseUrl)
      .post('v1/account/api-client-login')
      .send({
        'clientId': clientId,
        'clientSecret': clientSecret,
      })
    expect(response.status).toBe(201)
    expect(response.body).toBeDefined()
    expect(response.body).toHaveProperty('expiresIn')
    expect(response.body).toHaveProperty('token')
  })
  test('T02 - Error Credentials- Should return status 400 and an object containing Code, Message, and ShortMessage.', async () => {
    const response = await superTest(baseUrl)
      .post('v1/account/api-client-login')
      .send({
        'clientId': clientId,
        'clientSecret': 'clientSecret',
      })
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    expect(response.body.code).toEqual('CCA-002')
    expect(response.body.message).toEqual('The credentials are invalid.')
    expect(response.body.shortMessage).toEqual('CustomerAccessInvalidCredentials')
  })
  test('T03 - Other Errors- Should return status 400 and an object containing Code, Message, ShortMessage, and Details explaining the error.', async () => {
    const response = await superTest(baseUrl)
      .post('v1/account/api-client-login')
      .send({
        'clientId': 'clientId',
        'clientSecret': clientSecret,
      })
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    expect(response.body.code).toEqual('val-001')
    expect(response.body.message).toEqual('Validation Error')
    expect(response.body.shortMessage).toEqual('validationError')
    expect(response.body).toHaveProperty('details')
  })
})
