import {expect} from 'chai'
import feasibleTree from 'ciena-dagre/rank/feasible-tree'
import {Graph} from 'ciena-graphlib'
import {describe, it} from 'mocha'

describe('feasibleTree', function () {
  it('should create a tree for a trivial input graph', function () {
    const g = new Graph()
      .setNode('a', {rank: 0})
      .setNode('b', {rank: 1})
      .setEdge('a', 'b', {minlen: 1})

    const tree = feasibleTree(g)
    expect(g.node('b').rank).to.equal(g.node('a').rank + 1)
    expect(tree.neighbors('a')).to.eql(['b'])
  })

  it('should correctly shorten slack by pulling a node up', function () {
    const g = new Graph()
      .setNode('a', {rank: 0})
      .setNode('b', {rank: 1})
      .setNode('c', {rank: 2})
      .setNode('d', {rank: 2})
      .setPath(['a', 'b', 'c'], {minlen: 1})
      .setEdge('a', 'd', {minlen: 1})

    const tree = feasibleTree(g)
    expect(g.node('b').rank).to.eql(g.node('a').rank + 1)
    expect(g.node('c').rank).to.eql(g.node('b').rank + 1)
    expect(g.node('d').rank).to.eql(g.node('a').rank + 1)
    expect(tree.neighbors('a').sort()).to.eql(['b', 'd'])
    expect(tree.neighbors('b').sort()).to.eql(['a', 'c'])
    expect(tree.neighbors('c')).to.eql(['b'])
    expect(tree.neighbors('d')).to.eql(['a'])
  })

  it('should correctly shorten slack by pulling a node down', function () {
    const g = new Graph()
      .setNode('a', {rank: 2})
      .setNode('b', {rank: 0})
      .setNode('c', {rank: 2})
      .setEdge('b', 'a', {minlen: 1})
      .setEdge('b', 'c', {minlen: 1})

    const tree = feasibleTree(g)
    expect(g.node('a').rank).to.eql(g.node('b').rank + 1)
    expect(g.node('c').rank).to.eql(g.node('b').rank + 1)
    expect(tree.neighbors('a').sort()).to.eql(['b'])
    expect(tree.neighbors('b').sort()).to.eql(['a', 'c'])
    expect(tree.neighbors('c').sort()).to.eql(['b'])
  })
})
