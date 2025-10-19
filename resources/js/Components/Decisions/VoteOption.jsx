import { CheckIcon } from '@heroicons/react/24/solid';

export default function VoteOption({
    option,
    selected,
    onSelect,
    canVote,
    totalVotes,
    hasVoted,
    userVoteId
}) {
    const percentage = totalVotes > 0 ? (option.votes_count / totalVotes) * 100 : 0;
    const isUserVote = userVoteId === option.id;

    return (
        <div
            className={`
                relative rounded-lg border-2 p-4 cursor-pointer transition-all
                ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}
                ${!canVote && !hasVoted ? 'cursor-default' : ''}
                ${canVote ? 'hover:border-indigo-300' : ''}
                ${isUserVote ? 'ring-2 ring-green-500 ring-offset-2' : ''}
            `}
            onClick={onSelect}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <p className="font-medium text-gray-900">{option.text}</p>
                </div>
                <div className="flex items-center ml-4">
                    {isUserVote && (
                        <div className="flex items-center text-green-600 mr-2">
                            <CheckIcon className="w-5 h-5 mr-1" />
                            <span className="text-sm">Tu voto</span>
                        </div>
                    )}
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">{option.votes_count} votos</p>
                        <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                        isUserVote ? 'bg-green-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {canVote && (
                <div className="absolute top-4 left-4">
                    <input
                        type="radio"
                        checked={selected}
                        onChange={() => {}}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                </div>
            )}
        </div>
    );
}