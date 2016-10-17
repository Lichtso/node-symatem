/* global describe, it, xit, before, beforeEach, after, afterEach */
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const path = require('path'),
  fs = require('fs'),
  spawn = require('child_process').spawn,
  symatem = require('../api');

let cp;

const hrl =
  `
(name device1;
	networkInterface (
		ipv4Address 10.0.0.1;
		macAddress 72:41:0A:A9:58:01;
	);
)

(name device2;
	networkInterface (
		ipv4Address 10.0.0.2;
		macAddress 72:41:0A:A9:58:02;
	);
)
`;

describe('decode', () => {
  it('object present', () =>
    cp.then(connection => connection.upload('networkInterface')
      .then(result => connection.query(false, symatem.queryMask.VMV, 0, result[0], 0)
        .then(symbols => symbols.map(symbol => connection.decodeSymbolWithCache(symbol)))
        .then(dps => Promise.all(dps))
        .then(dps => assert.deepEqual(dps, [{
          a: 1
        }]))
      )
    ));

  before('start SymatemAPI', done => {
    const store = path.join(__dirname, 'test2.sdb');
    fs.unlink(store, error => {
      cp = symatem.open({
        store: store
      });
      done();
    });
  });

  after('stop SymatemAPI', done => {
    cp.then(c => c.close()).then(() => done());
  });
});
