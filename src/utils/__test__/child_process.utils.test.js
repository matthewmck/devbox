const { exec } = require('../child_process.utils');

describe('exec', () => {
    test('will output string', async () => {
        const data = await exec('ipconfig');
        expect(typeof data).toBe('string')
    })

    test('will throw an error', async () => {
        await expect(exec('ipconfig--')).rejects.toThrow()
    })
})