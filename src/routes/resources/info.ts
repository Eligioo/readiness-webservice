import { FastifyReply, FastifyRequest } from "fastify"

export async function info(req: FastifyRequest, res: FastifyReply) {
    // @ts-ignore
    const { redis } = res.server
    const cache = await redis.get("info")
    if (cache) {
        return res.send(JSON.parse(cache))
    }

    const consensus = await rpc('consensus', []);
    const validatorFile = await fetch('https://v2.nimiqwatch.com/api/v2/validators');
    let validators = await validatorFile.json();
    let totalStake = await (await fetch('https://v2.nimiqwatch.com/api/v2/total-prestake')).json();
    validators = validators.sort((a: any, b: any) => b.delegatedStake - a.delegatedStake);

    for await (const validator of validators) {
        validator.portion = (validator.delegatedStake + validator.deposit) / totalStake * 100;
        validator.transactions = (await rpc("getTransactionsByAddress", [validator.address]))
            .sort((a: any, b: any) => b.blockNumber - a.blockNumber);
    };

    const body = {
        consensus,
        totalStake,
        validators,
    }

    await redis.set("info", JSON.stringify(body))
    await redis.expire("info", 60)
    return res.send(body)
}

async function rpc(method: any, params: any) {
    let url = 'http://127.0.0.1:8648';
    let body = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params ? params : [],
        "id": 1
    }
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };

    let json = await (await fetch(url, options)).json()
    return json.result
}
