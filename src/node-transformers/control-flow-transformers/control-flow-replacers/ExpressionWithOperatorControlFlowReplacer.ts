import { inject, injectable, } from 'inversify';
import { ServiceIdentifiers } from '../../../container/ServiceIdentifiers';

import * as ESTree from 'estree';

import { TControlFlowCustomNodeFactory } from '../../../types/container/custom-nodes/TControlFlowCustomNodeFactory';
import { TStatement } from '../../../types/node/TStatement';

import { ICustomNode } from '../../../interfaces/custom-nodes/ICustomNode';
import { IOptions } from '../../../interfaces/options/IOptions';
import { IRandomGenerator } from '../../../interfaces/utils/IRandomGenerator';

import { ControlFlowCustomNode } from '../../../enums/custom-nodes/ControlFlowCustomNode';

import { AbstractControlFlowReplacer } from './AbstractControlFlowReplacer';
import { NodeGuards } from '../../../node/NodeGuards';

@injectable()
export abstract class ExpressionWithOperatorControlFlowReplacer extends AbstractControlFlowReplacer {
    /**
     * @type {IOptions}
     */
    protected readonly options: IOptions;

    /**
     * @type {Map<string, Map<string, string[]>>}
     */
    protected readonly replacerDataByControlFlowStorageId: Map <string, Map<string, string[]>> = new Map();

    /**
     * @param {TControlFlowCustomNodeFactory} controlFlowCustomNodeFactory
     * @param {IRandomGenerator} randomGenerator
     * @param {IOptions} options
     */
    constructor (
        @inject(ServiceIdentifiers.Factory__IControlFlowCustomNode)
            controlFlowCustomNodeFactory: TControlFlowCustomNodeFactory,
        @inject(ServiceIdentifiers.IRandomGenerator) randomGenerator: IRandomGenerator,
        @inject(ServiceIdentifiers.IOptions) options: IOptions
    ) {
        super(controlFlowCustomNodeFactory, randomGenerator, options);
    }

    /**
     * @param {string} controlFlowStorageId
     * @param {string} storageKey
     * @param {Expression} leftExpression
     * @param {Expression} rightExpression
     * @returns {NodeGuards}
     */
    protected getControlFlowStorageCallNode (
        controlFlowStorageId: string,
        storageKey: string,
        leftExpression: ESTree.Expression,
        rightExpression: ESTree.Expression
    ): ESTree.Node {
        const controlFlowStorageCallCustomNode: ICustomNode = this.controlFlowCustomNodeFactory(
            ControlFlowCustomNode.ExpressionWithOperatorControlFlowStorageCallNode
        );

        controlFlowStorageCallCustomNode.initialize(controlFlowStorageId, storageKey, leftExpression, rightExpression);

        const statementNode: TStatement = controlFlowStorageCallCustomNode.getNode()[0];

        if (!statementNode || !NodeGuards.isExpressionStatementNode(statementNode)) {
            throw new Error(`\`controlFlowStorageCallCustomNode.getNode()[0]\` should returns array with \`ExpressionStatement\` node`);
        }

        return statementNode.expression;
    }
}
