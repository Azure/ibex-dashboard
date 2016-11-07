"use strict"

 let a = new Map(), b = new Map();
 a.set("a", 2)
 a.set("b", 3)
 b.set("a", 4)
 b.set("b", 6)
 b.set("c", 8)
 new Map([...a, ...b]);