using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface ICandidatesService
    {
        Paged<Candidate> GetByPartyId(int partyId, int pageIndex, int pageSize);
        Candidate GetById(int id);
        int Add(CandidateAddRequest model, int userId);
        void Update(CandidateUpdateRequest model);

        List<Candidate> GetAll();
        Paged<Candidate> Pagination(int pageIndex, int pageSize);
        void Delete(int id);
        public Paged<Candidate> SearchPaginate(string query, int pageIndex, int pageSize);

        public int AddGroup(AddGroupRequest model, int groupId);
    }
}
