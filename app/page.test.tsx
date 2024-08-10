import {it,expect} from "vitest"
import {sample} from "./page"

it("First function test sample", ()=>{
    expect(sample(1,2)).toBe(2)
})